import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Get,
  Put,
  Delete,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { UpdateTodoDTO } from './dto/update_todo.dto';

@Controller('api/todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  // 투두 생성
  @Post()
  @ApiOperation({ summary: 'Todo 추가', description: 'Todo를 추가합니다.' })
  @ApiBody({ type: CreateTodoDTO })
  @ApiResponse({ status: 201, description: 'Todo 생성 성공' })
  @ApiResponse({ status: 500, description: 'Todo 생성 실패' })
  async create(@Body() dto: CreateTodoDTO) {
    try {
      const result = await this.todosService.create(dto);
      return { message: 'TODO 생성 성공', data: result };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Todo 생성 중 에러 발생');
    }
  }

  // 그룹 전체 멤버의 투두 조회
  @Get('group/:group_id')
  async getTodosByGroup(@Param('group_id') group_id: string) {
    return this.todosService.findTodosByGroup(group_id);
  }

  // 유저 개인의 전체 투두 조회
  @Get('user/:user_id')
  async getTodosByUser(@Param('user_id') user_id: string) {
    return this.todosService.findTodosByUser(user_id);
  }

  // 투두 수정
  @Put(':todo_id')
  @ApiOperation({
    summary: 'Todo 수정',
    description: 'Todo의 상태나 제목을 수정합니다.',
  })
  @ApiBody({ type: UpdateTodoDTO })
  @ApiResponse({ status: 200, description: 'Todo 수정 성공' })
  @ApiResponse({ status: 404, description: 'Todo를 찾을 수 없음' })
  async update(
    @Param('todo_id') todo_id: number,
    @Body() updateTodoDTO: UpdateTodoDTO,
  ) {
    return this.todosService.update(todo_id, updateTodoDTO);
  }

  // 투두 삭제
  @Delete(':todo_id')
  @ApiOperation({ summary: 'Todo 삭제', description: 'Todo를 삭제합니다.' })
  @ApiResponse({ status: 200, description: 'Todo 삭제 성공' })
  @ApiResponse({ status: 404, description: '삭제할 Todo가 존재하지 않습니다.' })
  // ParseUUIDPipe: UUID가 아닌 값이 들어오면 자동으로 예외 처리
  async deleteTodo(@Param('id', ParseUUIDPipe) todo_id: number) {
    return this.todosService.delete(todo_id);
  }
}
