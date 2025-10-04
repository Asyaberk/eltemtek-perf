import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../users/entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
        super({
            //extract token
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    //ATHIS PART IS FOR WHOAMI FUNC
                    //önce normal cookie parser
                    if (req?.cookies?.jwt) {
                        return req.cookies.jwt;
                    }
                    // fallback yaptık raw cookie headerdan manuel aldık çünkğ diğer türlü okuyamıyor yapamadı yani olmadı
                    const rawCookie = req?.headers?.cookie;
                    if (rawCookie) {
                        const match = rawCookie.split(';').find(c => c.trim().startsWith('jwt='));
                        return match ? match.split('=')[1] : null;
                    }
                    //bearer token
                    return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
                }
            ]),
            //the secret we gave before
            secretOrKey: 'cat'
        })
    }

    //will take the token from the bearer section, 
    //verify it with the secret, 
    //then decode the content and put it into the payload
    async validate(payload: any) {
        console.log('JWT Payload:', payload);
        const user = await this.repo.findOne({
            where: { id: payload.sub },
            relations: ['role']
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}