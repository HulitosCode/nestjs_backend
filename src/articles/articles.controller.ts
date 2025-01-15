import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiConflictResponse({ type: ArticleEntity })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() req: any,
  ): Promise<ArticleEntity> {
    // Aqui, o request.user deve estar preenchido pelo JwtAuthGuard
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id; // O userId vem do payload do JWT
    if (!userId) {
      throw new UnauthorizedException('User Id not found in request');
    }
    const article = await this.articlesService.create(createArticleDto, userId);
    return new ArticleEntity(article);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll(@Req() req: any): Promise<ArticleEntity[]> {
    const userId = req.user.id;
    const articles = await this.articlesService.findAll(userId);

    return articles.map((article) => new ArticleEntity(article));
  }

  @Get('drafts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.articlesService.findDrafts();

    return drafts.map((draft) => new ArticleEntity(draft));
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException('Article not found!');
    }
    return new ArticleEntity(article);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return new ArticleEntity(
      await this.articlesService.update(id, updateArticleDto),
    );
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
