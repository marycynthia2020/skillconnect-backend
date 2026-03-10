import { ModelStatic } from "sequelize";

declare module "../models" {
  export const User: ModelStatic<any>
  export const Client: ModelStatic<any>
  export const Artisan: ModelStatic<any>
  export const RefreshToken: ModelStatic<any>
  export const RevokedToken: ModelStatic<any>
  export const Skill: ModelStatic<any>
  export const ArtisanSkill: ModelStatic<any>
  export const RevokedToken: ModelStatic<any>
}
