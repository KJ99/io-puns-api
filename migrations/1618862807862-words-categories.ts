import {MigrationInterface, QueryRunner} from "typeorm";

export class wordsCategories1618862807862 implements MigrationInterface {
    name = 'wordsCategories1618862807862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `categories` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `active` tinyint NOT NULL, UNIQUE INDEX `IDX_8b0be371d28245da6e4f4b6187` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `words` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `active` tinyint NOT NULL, UNIQUE INDEX `IDX_975efd50047f02b2266a8d8e9c` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_975efd50047f02b2266a8d8e9c` ON `words`");
        await queryRunner.query("DROP TABLE `words`");
        await queryRunner.query("DROP INDEX `IDX_8b0be371d28245da6e4f4b6187` ON `categories`");
        await queryRunner.query("DROP TABLE `categories`");
    }

}
