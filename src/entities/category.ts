import { Expose } from "class-transformer"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm"
import Word from './word'

@Entity({
    name: 'categories'
})
export default class Category {
    
    @PrimaryGeneratedColumn()
    @Expose()
    id!: number

    @Column({ unique: true })
    @Expose()
    name!: string

    @Column()
    @Expose()
    active: boolean = true

    @OneToMany(() => Word, word => word.category, {
        onDelete: 'CASCADE',
        eager: true 
    })
    @JoinColumn({ name: 'category_id' })
    words: Word[]

    constructor() {
    }

}

