import {MigrationInterface, QueryRunner} from "typeorm";

export class categoriesWordsRelation1618863924108 implements MigrationInterface {
    name = 'categoriesWordsRelation1618863924108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `words` ADD `category_id` int NULL");
        await queryRunner.query("ALTER TABLE `words` ADD CONSTRAINT `FK_e6ef47d6cff6a807b437bdc2b66` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `words` DROP FOREIGN KEY `FK_e6ef47d6cff6a807b437bdc2b66`");
        await queryRunner.query("ALTER TABLE `words` DROP COLUMN `category_id`");
    }

}
