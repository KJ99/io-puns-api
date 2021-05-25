import { Expose } from "class-transformer"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import Category from './category'

@Entity({
    name: 'words'
})
export default class Word {
    
    @PrimaryGeneratedColumn()
    @Expose()
    id!: number

    @Column({ unique: true })
    @Expose()
    name!: string

    @Column()
    @Expose()
    active: boolean = true

    @ManyToOne(() => Category, category => category.words, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: Category|undefined
}