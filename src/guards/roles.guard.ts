import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
 
@Injectable()
export class RolesGuard implements CanActivate {

    //we need to extract the required roles by using reflector
    constructor(private readonly reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean {
        
        //use reflector to extract required roles
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        //null role check
        if (!requiredRoles) return true;

        //extract user from request object
        const user = context.switchToHttp().getRequest().user;
        //check if the user has one of the required roles
        //some func takes a call back and loop through all of the members of the required roles list 
        // and if that callback return true at least one of the members from list, some func returns true
        const hasRequiredRole = requiredRoles.some((role) => user.role?.name === role);

        //throw forbidden exception
        if (!hasRequiredRole) {
            throw new ForbiddenException(
                `Access denied: You do not have the required permissions to perform this action!`
            );
        }

        return true;
    }
}