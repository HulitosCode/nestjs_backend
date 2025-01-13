import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  //The constructor takes an object and uses the Object.assign() method to copy the properties from the partial object to the UserEntity instance. The type of partial is Partial<UserEntity>. This means that the partial object can contain any subset of the properties defined in the UserEntity class.
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  //@ApiProperty decorator will only hide the password property from the Swagger documentation.
  @Exclude()
  password: string;
}
