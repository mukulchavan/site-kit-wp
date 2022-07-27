/**
 * Validation utilities.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { getColorThemes } from './settings';

const validButtonPlacements = [
	'dynamic_low',
	'dynamic_high',
	'static_auto',
	'static_above-content',
	'static_below-content',
	'static_below-first-paragraph',
];

/**
 * Checks if the given publication ID appears to be a valid.
 *
 * @since 1.78.0
 *
 * @param {string} publicationID Publication ID to test.
 * @return {boolean} `true` if the given publication ID is valid, `false` otherwise.
 */
export function isValidPublicationID( publicationID ) {
	return (
		typeof publicationID === 'string' &&
		/^[A-Za-z0-9_.-]+$/.test( publicationID )
	);
}

/**
 * Checks if the given color theme is valid.
 *
 * @since 1.78.0
 *
 * @param {string} colorTheme Color theme to test.
 * @return {boolean} `true` if the given color theme is valid, `false` otherwise.
 */
export function isValidColorTheme( colorTheme ) {
	const validColorThemes = getColorThemes();
	return validColorThemes.some(
		( { colorThemeID } ) => colorThemeID === colorTheme
	);
}

/**
 * Checks if the given button placement is valid.
 *
 * @since 1.78.0
 *
 * @param {string} buttonPlacement Button placement to test.
 * @return {boolean} `true` if the given button placement is valid, `false` otherwise.
 */
export function isValidButtonPlacement( buttonPlacement ) {
	return validButtonPlacements.includes( buttonPlacement );
}

/**
 * Checks if the given buttonPostTypes array is valid.
 *
 * @since 1.78.0
 *
 * @param {string[]} buttonPostTypes Button post types to test.
 * @return {boolean} `true` if the given button post types list is valid, `false` otherwise.
 */
export function isValidButtonPostTypes( buttonPostTypes ) {
	return (
		Array.isArray( buttonPostTypes ) &&
		buttonPostTypes.length >= 1 &&
		buttonPostTypes.every( ( buttonPostType ) => buttonPostType.length > 0 )
	);
}