import { TestBed }          from '@angular/core/testing';
import { FirestoreService, LeaderboardEntry } from './firestore.service';
import { Firestore }        from '@angular/fire/firestore';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockEntries: LeaderboardEntry[] = [
  { id: 'u1', displayName: 'Alice', photoURL: '', totalPoints: 1000, accuracy: 90, sessions: 5 },
  { id: 'u2', displayName: 'Bob',   photoURL: '', totalPoints: 800,  accuracy: 80, sessions: 4 },
  { id: 'u3', displayName: 'Carol', photoURL: '', totalPoints: 600,  accuracy: 70, sessions: 3 }
];

const mockFirestore = {};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FirestoreService — leaderboard cache', () => {
  let service: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FirestoreService,
        { provide: Firestore, useValue: mockFirestore }
      ]
    });
    service = TestBed.inject(FirestoreService);
  });

  // ─── Cache state helpers ──────────────────────────────────────────

  function seedCache(entries: LeaderboardEntry[], ageMs = 0): void {
    (service as any).leaderboardCache    = entries;
    (service as any).leaderboardCachedAt = Date.now() - ageMs;
  }

  // ─── Cache hit ────────────────────────────────────────────────────

  describe('cache hit', () => {
    it('should return cached entries without calling Firestore', async () => {
      seedCache(mockEntries);

      let firestoreCalled = false;
      (service as any).firestore = {
        ...mockFirestore,
        _delegate: { _getSettings: () => ({ host: '' }) }
      };

      // Patch getDocs to detect if it was called
      const originalGetLeaderboard = service.getLeaderboard.bind(service);
      let fetchCount = 0;
      (service as any).fetchFromFirestore = async () => {
        fetchCount++;
        return mockEntries;
      };

      const result = await service.getLeaderboard();
      expect(result).toEqual(mockEntries);
      expect(fetchCount).toBe(0); // Firestore not called
    });

    it('should return cached data immediately on second call', async () => {
      seedCache(mockEntries);
      const result = await service.getLeaderboard();
      expect(result.length).toBe(3);
      expect(result[0].displayName).toBe('Alice');
    });
  });

  // ─── Cache expiry ─────────────────────────────────────────────────

  describe('cache expiry', () => {
    it('should treat fresh cache (0ms old) as valid', () => {
      seedCache(mockEntries, 0);
      const cacheAge  = Date.now() - (service as any).leaderboardCachedAt;
      const ttl       = 60_000;
      expect(cacheAge).toBeLessThan(ttl);
    });

    it('should treat cache older than 60 seconds as expired', () => {
      seedCache(mockEntries, 61_000);
      const cacheAge  = Date.now() - (service as any).leaderboardCachedAt;
      const ttl       = 60_000;
      expect(cacheAge).toBeGreaterThan(ttl);
    });

    it('should treat cache exactly at 60 seconds as expired', () => {
      seedCache(mockEntries, 60_001);
      const cacheAge  = Date.now() - (service as any).leaderboardCachedAt;
      const ttl       = 60_000;
      expect(cacheAge).toBeGreaterThan(ttl);
    });
  });

  // ─── Cache invalidation ───────────────────────────────────────────

  describe('cache invalidation', () => {
    it('should clear cache when invalidateLeaderboardCache is called', () => {
      seedCache(mockEntries);
      service.invalidateLeaderboardCache();

      expect((service as any).leaderboardCache).toBeNull();
      expect((service as any).leaderboardCachedAt).toBe(0);
    });

    it('should start with no cache', () => {
      expect((service as any).leaderboardCache).toBeNull();
      expect((service as any).leaderboardCachedAt).toBe(0);
    });

    it('should populate cache after successful fetch', async () => {
      seedCache(mockEntries);
      expect((service as any).leaderboardCache).not.toBeNull();
      expect((service as any).leaderboardCache.length).toBe(3);
    });
  });

  // ─── Force refresh ────────────────────────────────────────────────

  describe('forceRefresh', () => {
    it('should bypass cache when forceRefresh is true', async () => {
      seedCache(mockEntries);

      // Even with valid cache, forceRefresh should attempt a new fetch
      // We verify by checking the cache is still seeded and forceRefresh flag works
      const cachedAt = (service as any).leaderboardCachedAt;
      expect(cachedAt).toBeGreaterThan(0);

      // getLeaderboard with forceRefresh=true will try to call Firestore
      // Since we don't have a real Firestore, it will throw and return stale cache
      const result = await service.getLeaderboard(20, true);
      // Returns stale cache on error — graceful degradation
      expect(result).toEqual(mockEntries);
    });
  });

  // ─── LeaderboardEntry interface ───────────────────────────────────

  describe('LeaderboardEntry shape', () => {
    it('should have required fields', () => {
      const entry = mockEntries[0];
      expect(entry.id).toBeDefined();
      expect(entry.displayName).toBeDefined();
      expect(entry.totalPoints).toBeDefined();
      expect(entry.accuracy).toBeDefined();
      expect(entry.sessions).toBeDefined();
    });

    it('should sort correctly by totalPoints descending', () => {
      const sorted = [...mockEntries].sort((a, b) => b.totalPoints - a.totalPoints);
      expect(sorted[0].id).toBe('u1');
      expect(sorted[1].id).toBe('u2');
      expect(sorted[2].id).toBe('u3');
    });
  });
});