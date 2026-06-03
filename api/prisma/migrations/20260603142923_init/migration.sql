-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_links" (
    "id" SERIAL NOT NULL,
    "requesterId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "linkId" INTEGER,
    "sharedWatchId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared_watches" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shared_watches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_items" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "posterPath" TEXT,
    "backdropPath" TEXT,
    "voteAverage" DOUBLE PRECISION NOT NULL,
    "releaseDate" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'movie',
    "genreIds" JSONB,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_tracks" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'want_to_watch',
    "libraryItemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tv_tracks" (
    "id" SERIAL NOT NULL,
    "totalEpisodes" INTEGER NOT NULL DEFAULT 0,
    "libraryItemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tv_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tv_episodes" (
    "id" SERIAL NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "watched" BOOLEAN NOT NULL DEFAULT false,
    "tvTrackId" INTEGER NOT NULL,

    CONSTRAINT "tv_episodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_links_requesterId_receiverId_key" ON "user_links"("requesterId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "shared_watches_tmdbId_mediaType_ownerId_partnerId_key" ON "shared_watches"("tmdbId", "mediaType", "ownerId", "partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "library_items_userId_tmdbId_mediaType_key" ON "library_items"("userId", "tmdbId", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "movie_tracks_libraryItemId_key" ON "movie_tracks"("libraryItemId");

-- CreateIndex
CREATE UNIQUE INDEX "tv_tracks_libraryItemId_key" ON "tv_tracks"("libraryItemId");

-- CreateIndex
CREATE UNIQUE INDEX "tv_episodes_tvTrackId_seasonNumber_episodeNumber_key" ON "tv_episodes"("tvTrackId", "seasonNumber", "episodeNumber");

-- AddForeignKey
ALTER TABLE "user_links" ADD CONSTRAINT "user_links_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_links" ADD CONSTRAINT "user_links_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_watches" ADD CONSTRAINT "shared_watches_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_watches" ADD CONSTRAINT "shared_watches_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_items" ADD CONSTRAINT "library_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_tracks" ADD CONSTRAINT "movie_tracks_libraryItemId_fkey" FOREIGN KEY ("libraryItemId") REFERENCES "library_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tv_tracks" ADD CONSTRAINT "tv_tracks_libraryItemId_fkey" FOREIGN KEY ("libraryItemId") REFERENCES "library_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tv_episodes" ADD CONSTRAINT "tv_episodes_tvTrackId_fkey" FOREIGN KEY ("tvTrackId") REFERENCES "tv_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
