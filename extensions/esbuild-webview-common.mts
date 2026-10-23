/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Common build script for extension scripts used in in webviews.
 */

import type esbuild from 'esbuild';
import { runBuild, type RunConfig } from './esbuild-common.mts';

const baseOptions: esbuild.BuildOptions = {
	bundle: true,
	minify: true,
	sourcemap: false,
	format: 'esm' as const,
	platform: 'browser' as const,
	target: ['es2024'],
	logOverride: {
		'import-is-undefined': 'error',
	},
	// Webviews and notebook renderers can share their page with scripts that install a global AMD
	// `define` (e.g. RequireJS from the Jupyter renderer preloads). Bundled UMD dependencies such as
	// fastdom (used by mermaid) would then register with that loader instead of exporting normally.
	define: {
		'define': 'undefined',
	},
};

export async function run(
	config: RunConfig,
	args: string[],
	didBuild?: (outDir: string) => unknown
): Promise<void> {
	return runBuild(config, baseOptions, args, didBuild);
}
