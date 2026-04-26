import { Perfil } from "../types/Perfil.js";
type Action = "create" | "read" | "update" | "delete";
type PermissionMap = {
    [module: string]: {
        [perfil in Perfil]?: Action[];
    };
};
export declare const permissions: PermissionMap;
export {};
//# sourceMappingURL=permissions.d.ts.map