/**
 * Validation function tests.
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
import { isValidWebDataStreamID } from './validation';

describe( 'modules/analytics-4 validations', () => {
	describe( 'isValidWebDataStreamID', () => {
		it( 'should return TRUE when a valid webDataStreamID is passed', () => {
			expect( isValidWebDataStreamID( '12345' ) ).toBe( true );
		} );

		it.each( [
			[ 'undefined', undefined ],
			[ 'null', null ],
			[ 'false', false ],
			[ 'a number', 12345 ],
		] )( 'should return FALSE when %s is passed', ( _, webDataStreamID ) => {
			expect( isValidWebDataStreamID( webDataStreamID ) ).toBe( false );
		} );
	} );
} );