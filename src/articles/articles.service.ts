import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Article } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prismaService: PrismaService) {}

  create(createArticleDto: CreateArticleDto, userId: number): Promise<Article> {
    return this.prismaService.article.create({
      data: {
        ...createArticleDto,
        authorId: userId, // Associar o artigo ao usuário autenticado
      },
    });
  }

  findDrafts() {
    return this.prismaService.article.findMany({
      where: {
        published: false,
      },
    });
  }

  findAll(userId: number): Promise<Article[]> {
    return this.prismaService.article.findMany({
      where: {
        published: true,
        authorId: userId, // Filtra artigos publicados do usuário
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.article.findUnique({
      where: {
        id,
      },
      include: {
        author: true, // Incluir dados do autor
      },
    });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prismaService.article.update({
      where: {
        id,
      },
      data: updateArticleDto, // Atualizar os dados do artigo
    });
  }

  remove(id: number) {
    return this.prismaService.article.delete({
      where: {
        id,
      },
    });
  }
}
