interface IState {
    enter(): void;
    leave(): void;
    suspend(): void;
    resume(): void;
}