import { BeforeInsert } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', { unique: true })
  title: string;
  @Column('float', {
    default: 0,
  })
  price: number;
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;
  @Column('text', { unique: true })
  slug: string;
  @Column('int', { default: 0 })
  stock: number;
  @Column('text', { array: true })
  sizes: string[];
  @Column('text')
  gender: string;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
