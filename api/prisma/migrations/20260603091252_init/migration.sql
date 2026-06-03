-- CreateTable
CREATE TABLE `library_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tmdbId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `overview` TEXT NOT NULL,
    `posterPath` VARCHAR(191) NULL,
    `backdropPath` VARCHAR(191) NULL,
    `voteAverage` DOUBLE NOT NULL,
    `releaseDate` VARCHAR(191) NULL,
    `mediaType` VARCHAR(191) NOT NULL DEFAULT 'movie',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `library_items_tmdbId_mediaType_key`(`tmdbId`, `mediaType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie_tracks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL DEFAULT 'want_to_watch',
    `libraryItemId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `movie_tracks_libraryItemId_key`(`libraryItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tv_tracks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalEpisodes` INTEGER NOT NULL DEFAULT 0,
    `libraryItemId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tv_tracks_libraryItemId_key`(`libraryItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tv_episodes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seasonNumber` INTEGER NOT NULL,
    `episodeNumber` INTEGER NOT NULL,
    `watched` BOOLEAN NOT NULL DEFAULT false,
    `tvTrackId` INTEGER NOT NULL,

    UNIQUE INDEX `tv_episodes_tvTrackId_seasonNumber_episodeNumber_key`(`tvTrackId`, `seasonNumber`, `episodeNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `movie_tracks` ADD CONSTRAINT `movie_tracks_libraryItemId_fkey` FOREIGN KEY (`libraryItemId`) REFERENCES `library_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tv_tracks` ADD CONSTRAINT `tv_tracks_libraryItemId_fkey` FOREIGN KEY (`libraryItemId`) REFERENCES `library_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tv_episodes` ADD CONSTRAINT `tv_episodes_tvTrackId_fkey` FOREIGN KEY (`tvTrackId`) REFERENCES `tv_tracks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
