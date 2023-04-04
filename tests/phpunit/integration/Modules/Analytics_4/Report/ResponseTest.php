<?php
/**
 * Class Google\Site_Kit\Tests\Modules\Analytics_4\Report\ResponseTest
 *
 * @package   Google\Site_Kit\Tests\Modules\Analytics_4\Report
 * @copyright 2023 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Modules\Analytics_4;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\REST_API\Data_Request;
use Google\Site_Kit\Modules\Analytics_4\Report\Row_Trait as Analytics_4_Report_Row_Trait;
use Google\Site_Kit\Modules\Analytics_4\Report\Response as Analytics_4_Report_Response;
use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\MetricHeader;
use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\RunReportResponse;
use Google\Site_Kit\Tests\TestCase;

/**
 * @group Modules
 * @group Analytics_4
 * @group Report
 */
class ResponseTest extends TestCase {

	use Analytics_4_Report_Row_Trait;

	const DEFAULT_VALUE_FOR_EXISTING_ROWS = '99';

	/**
	 * @var Analytics_4_Report_Response
	 */
	protected $report_response;

	public function set_up() {
		parent::set_up();

		$context               = new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE );
		$this->report_response = new Analytics_4_Report_Response( $context );
	}

	private function get_parsed_response_for_args( $report_args, $initial_data ) {
		$first_metric = new MetricHeader();
		$first_metric->setType( 'TYPE_INTEGER' );

		$second_metric = new MetricHeader();
		$second_metric->setType( 'TYPE_KILOMETERS' );

		$data          = new Data_Request( '', '', '', '', $report_args );
		$metric_header = array( $first_metric, $second_metric );

		$response = new RunReportResponse();
		$response->setMetricHeaders( $metric_header );

		if ( ! empty( $initial_data ) ) {
			$report_rows = array();

			foreach ( $initial_data as $initial_row ) {
				$report_rows[] = $this->create_report_row(
					$metric_header,
					$initial_row[0],
					isset( $initial_row[1] ) ? $initial_row[1] : false,
					self::DEFAULT_VALUE_FOR_EXISTING_ROWS
				);
			}

			$response->setRows( $report_rows );
			$response->setRowCount( count( $report_rows ) );
		}

		return $this->report_response->parse_response( $data, $response );
	}

	public function data_report_args() {
		return array(
			'single range'                                => array(
				array(
					'report_args'               => array(
						'startDate'  => '2023-02-01',
						'endDate'    => '2023-02-03',
						'dimensions' => 'date',
					),
					'initial_data'              => array(),
					'expected_dates_and_ranges' => array(
						array( '20230201' ),
						array( '20230202' ),
						array( '20230203' ),
					),
					'expected_dimension_values' => 1,
				),
			),
			'multiple ranges'                             => array(
				array(
					'report_args'               => array(
						'startDate'        => '2022-12-05',
						'endDate'          => '2022-12-07',
						'compareStartDate' => '2022-12-02',
						'compareEndDate'   => '2022-12-04',
						'dimensions'       => 'date',
					),
					'initial_data'              => array(),
					'expected_dates_and_ranges' => array(
						array( '20221202', 'date_range_1' ),
						array( '20221202', 'date_range_0' ),
						array( '20221203', 'date_range_1' ),
						array( '20221203', 'date_range_0' ),
						array( '20221204', 'date_range_1' ),
						array( '20221204', 'date_range_0' ),
						array( '20221205', 'date_range_0' ),
						array( '20221205', 'date_range_1' ),
						array( '20221206', 'date_range_0' ),
						array( '20221206', 'date_range_1' ),
						array( '20221207', 'date_range_0' ),
						array( '20221207', 'date_range_1' ),
					),
					'expected_dimension_values' => 2,
				),
			),
			'overlapping ranges'                          => array(
				array(
					'report_args'               => array(
						'startDate'        => '2023-01-01',
						'endDate'          => '2023-01-04',
						'compareStartDate' => '2023-01-03',
						'compareEndDate'   => '2023-01-05',
						'dimensions'       => 'date',
					),
					'initial_data'              => array(),
					'expected_dates_and_ranges' => array(
						array( '20230101', 'date_range_0' ),
						array( '20230101', 'date_range_1' ),
						array( '20230102', 'date_range_0' ),
						array( '20230102', 'date_range_1' ),
						array( '20230103', 'date_range_0' ),
						array( '20230103', 'date_range_1' ),
						array( '20230104', 'date_range_0' ),
						array( '20230104', 'date_range_1' ),
						array( '20230105', 'date_range_1' ),
						array( '20230105', 'date_range_0' ),
					),
					'expected_dimension_values' => 2,
				),
			),
			'some rows exist in the single range request' => array(
				array(
					'report_args'               => array(
						'startDate'  => '2023-02-01',
						'endDate'    => '2023-02-05',
						'dimensions' => 'date',
					),
					'initial_data'              => array(
						array( '20230201' ),
						array( '20230204' ),
					),
					'expected_dates_and_ranges' => array(
						array( '20230201' ),
						array( '20230202' ),
						array( '20230203' ),
						array( '20230204' ),
						array( '20230205' ),
					),
					'expected_dimension_values' => 1,
				),
			),
			'some rows exist in the multi ranges request' => array(
				array(
					'report_args'               => array(
						'startDate'        => '2023-02-01',
						'endDate'          => '2023-02-03',
						'compareStartDate' => '2023-01-01',
						'compareEndDate'   => '2023-01-03',
						'dimensions'       => 'date',
					),
					'initial_data'              => array(
						array( '20230101', 1 ),
						array( '20230203', 0 ),
					),
					'expected_dates_and_ranges' => array(
						array( '20230101', 'date_range_1' ),
						array( '20230101', 'date_range_0' ),
						array( '20230102', 'date_range_1' ),
						array( '20230102', 'date_range_0' ),
						array( '20230103', 'date_range_1' ),
						array( '20230103', 'date_range_0' ),
						array( '20230201', 'date_range_0' ),
						array( '20230201', 'date_range_1' ),
						array( '20230202', 'date_range_0' ),
						array( '20230202', 'date_range_1' ),
						array( '20230203', 'date_range_0' ),
						array( '20230203', 'date_range_1' ),
					),
					'expected_dimension_values' => 2,
				),
			),
		);
	}

	/**
	 * @dataProvider data_report_args
	 */
	public function test_parse_response( $args ) {
		$response = $this->get_parsed_response_for_args( $args['report_args'], $args['initial_data'] );
		$this->assertEquals( count( $args['expected_dates_and_ranges'] ), $response->getRowCount() );

		foreach ( $response->getRows() as $i => $row ) {
			// Verify that dimension values are set correctly.
			$dimension_values = $row->getDimensionValues();
			$this->assertCount( $args['expected_dimension_values'], $dimension_values );
			$this->assertEquals( $args['expected_dates_and_ranges'][ $i ][0], $dimension_values[0]->getValue() );
			if ( $args['expected_dimension_values'] > 1 ) {
				$this->assertEquals( $args['expected_dates_and_ranges'][ $i ][1], $dimension_values[1]->getValue() );
			}

			// Get the expected value for metrics. If the row has already existed in the report response
			// then its value should not be zero.
			$expected_metric_values = '0';
			foreach ( $args['initial_data'] as $initial_data ) {
				// Skip if this initial row is for a wrong date.
				if ( $dimension_values[0]->getValue() !== $initial_data[0] ) {
					continue;
				}

				// Skip if this initial row is for a wrong date range.
				if ( count( $initial_data ) === 2 && $dimension_values[1]->getValue() !== "date_range_{$initial_data[1]}" ) {
					continue;
				}

				// Otherwise if date and date range match, then the current row exists in the intial
				// data and we need to use the default value for initial rows.
				$expected_metric_values = self::DEFAULT_VALUE_FOR_EXISTING_ROWS;
				break;
			}

			// Verify that metric values are set correctly.
			$metric_values = $row->getMetricValues();
			$this->assertEquals( $expected_metric_values, $metric_values[0]->getValue() );
			$this->assertEquals( $expected_metric_values, $metric_values[1]->getValue() );
		}
	}

}
