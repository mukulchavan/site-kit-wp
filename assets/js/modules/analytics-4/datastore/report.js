/**
 * `modules/analytics-4` data store: report.
 *
 * Site Kit by Google, Copyright 2022 Google LLC
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
 * External dependencies
 */
import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import Data from 'googlesitekit-data';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';
import { MODULES_ANALYTICS_4 } from './constants';
import { stringifyObject } from '../../../util';
import {
	isValidDateRange,
	isValidOrders,
} from '../../../util/report-validation';
import {
	normalizeReportOptions,
	isValidDimensionFilters,
	isValidDimensions,
	isValidMetrics,
} from '../utils';

const fetchGetReportStore = createFetchStore( {
	baseName: 'getReport',
	controlCallback: ( { options } ) => {
		return API.get(
			'modules',
			'analytics-4',
			'report',
			normalizeReportOptions( options )
		);
	},
	reducerCallback: ( state, report, { options } ) => {
		return {
			...state,
			reports: {
				...state.reports,
				[ stringifyObject( options ) ]: report,
			},
		};
	},
	argsToParams: ( options ) => {
		return { options };
	},
	validateParams: ( { options } = {} ) => {
		invariant(
			isPlainObject( options ),
			'Options for Analytics 4 report must be an object.'
		);
		invariant(
			isValidDateRange( options ),
			'Either date range or start/end dates must be provided for Analytics 4 report.'
		);

		const { metrics, dimensions, dimensionFilters, orderby } =
			normalizeReportOptions( options );

		invariant(
			metrics.length,
			'Requests must specify at least one metric for an Analytics 4 report.'
		);
		invariant(
			isValidMetrics( metrics ),
			'Metrics for an Analytics 4 report must be either a string, an array of strings, an object, an array of objects or a mix of strings and objects. If an object is used, it must have "expression" and "alias" properties.'
		);

		if ( dimensions ) {
			invariant(
				isValidDimensions( dimensions ),
				'Dimensions for an Analytics 4 report must be either a string, an array of strings, an object, an array of objects or a mix of strings and objects. If an object is used, it must have "name" property.'
			);
		}

		if ( dimensionFilters ) {
			invariant(
				isValidDimensionFilters( dimensionFilters ),
				'Dimension filters must be a map of dimension names as keys and dimension values as values.'
			);
		}

		if ( orderby ) {
			invariant(
				isValidOrders( orderby ),
				'Orders for an Analytics report must be either an object or an array of objects where each object should have "fieldName" and "sortOrder" properties.'
			);
		}
	},
} );

const baseInitialState = {
	reports: {},
};

const baseResolvers = {
	*getReport( options = {} ) {
		const registry = yield Data.commonActions.getRegistry();
		const existingReport = registry
			.select( MODULES_ANALYTICS_4 )
			.getReport( options );

		// If there is already a report loaded in state, consider it fulfilled
		// and don't make an API request.
		if ( existingReport ) {
			return;
		}

		yield fetchGetReportStore.actions.fetchGetReport( options );
	},
};

const baseSelectors = {
	/**
	 * Gets an Analytics report for the given options.
	 *
	 * @since 1.13.0
	 *
	 * @param {Object}         state                       Data store's state.
	 * @param {Object}         options                     Options for generating the report.
	 * @param {string}         options.startDate           Required, unless dateRange is provided. Start date to query report data for as YYYY-mm-dd.
	 * @param {string}         options.endDate             Required, unless dateRange is provided. End date to query report data for as YYYY-mm-dd.
	 * @param {string}         options.dateRange           Required, alternative to startDate and endDate. A date range string such as 'last-28-days'.
	 * @param {Array.<string>} options.metrics             Required. List of metrics to query.
	 * @param {boolean}        [options.compareDateRanges] Optional. Only relevant with dateRange. Default false.
	 * @param {boolean}        [options.multiDateRange]    Optional. Only relevant with dateRange. Default false.
	 * @param {string}         [options.compareStartDate]  Optional. Start date to compare report data for as YYYY-mm-dd.
	 * @param {string}         [options.compareEndDate]    Optional. End date to compare report data for as YYYY-mm-dd.
	 * @param {Array.<string>} [options.dimensions]        Optional. List of dimensions to group results by. Default an empty array.
	 * @param {Object}         [options.dimensionFilters]  Optional. Map of dimension filters for filtering options on a dimension. Default an empty object.
	 * @param {Array.<Object>} [options.orderby]           Optional. An order definition object, or a list of order definition objects, each one containing 'fieldName' and 'sortOrder'. 'sortOrder' must be either 'ASCENDING' or 'DESCENDING'. Default empty array.
	 * @param {string}         [options.url]               Optional. URL to get a report for only this URL. Default an empty string.
	 * @param {number}         [options.limit]             Optional. Maximum number of entries to return. Default 1000.
	 * @return {(Array.<Object>|undefined)} An Analytics report; `undefined` if not loaded.
	 */
	getReport( state, options ) {
		const { reports } = state;

		return reports[ stringifyObject( options ) ];
	},
};

const store = Data.combineStores( fetchGetReportStore, {
	initialState: baseInitialState,
	resolvers: baseResolvers,
	selectors: baseSelectors,
} );

export const initialState = store.initialState;
export const actions = store.actions;
export const controls = store.controls;
export const reducer = store.reducer;
export const resolvers = store.resolvers;
export const selectors = store.selectors;

export default store;
