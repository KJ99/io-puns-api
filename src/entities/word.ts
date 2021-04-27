import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import Category from './category'

@Entity({
    name: 'words'
})
export default class Word {
    
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true })
    name!: string

    @Column()
    active: boolean = true

    @ManyToOne(() => Category, category => category.words, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: Category|undefined
}