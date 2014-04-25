/*
Typing for diff_match_patch.js
Copyright (c) Lisa. All rights reserved.

Typing only include functions and variables that are needed right now.
*/

//declare function DiffMatchPatch(): DiffMatchPatch.diff_match_patch;

declare class diff_match_patch {
    constructor();

    static Diff: any;

    static DIFF_DELETE: number;
    static DIFF_INSERT: number;
    static DIFF_EQUAL: number;

    Diff_Timeout: number;
    Diff_EditCost: number;
    Match_Threshold: number;
    Patch_DeleteThreshold: number;
    Patch_Margin: number;
    Match_MaxBits: number;

    diff_main(text1: string, text2: string, opt_checklines?: boolean, opt_deadline?: number): any[];
    diff_cleanupSemantic(diffs: any[]): any[];
    diff_cleanupEfficiency(diffs: any[]): any[];

    patch_make(text1: string, text2: string): any[];
    patch_make(diffs: any[]): any[];
    patch_make(text1: string, diffs: any[]): any[];

    patch_toText(patches: any[]): string;
    patch_fromText(text: string): any[];

    patch_apply(patches: any[], text1: string): any[];
}