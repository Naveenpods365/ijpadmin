export { authService } from "./authService";
export { userService } from "./userService";
export { postService } from "./postService";

export type { LoginPayload, LoginResponse, RegisterAdminPayload } from "./authService";
export type {
    User,
    UsersListResponse,
    UserDetailResponse,
} from "./userService";
export type {
    Post,
    PostsListResponse,
    PostDetailResponse,
} from "./postService";
