import { createParamDecorator, ExecutionContext } from "@nestjs/common";

//for whoami
export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        //jwtstrategy validate ile set ettiğimiz kullanıcı
        return request.user;
    }
) 