interface State {
    /**
     * Enters the state.
     */
    enter(): void;

    /**
     * Leaves the state.
     */
    leave(): void;

    /**
     * Suspends the state.
     */
    suspend(): void;

    /**
     * Resumes the state.
     */
    resume(): void;

    /**
     * Gets or sets the StateMachine the state is added to.
    */
    stateMachine: StateMachine;
}