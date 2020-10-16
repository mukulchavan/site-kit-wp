/**
 * External dependencies
 */
import { storiesOf } from '@storybook/react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Layout from '../assets/js/components/layout/layout';

storiesOf( 'Global/Layout', module )
	.add( 'Layout with Header Footer and CTAs', () => (
		<Layout
			header
			footer
			title={ __( 'Title', 'google-site-kit' ) }
			headerCTALabel={ __( 'Header CTA Label', 'google-site-kit' ) }
			headerCTALink="#"
			footerCTALabel={ __( 'Footer CTA Label', 'google-site-kit' ) }
			footerCTALink="#"
		>
			{ __( 'Child Content', 'google-site-kit' ) }
		</Layout>
	) )
	.add( 'Layout with Header and Footer', () => (
		<Layout
			header
			footer
			title={ __( 'Title', 'google-site-kit' ) }
			footerContent={ __( 'Footer Content', 'google-site-kit' ) }
		>
			{ __( 'Child Content', 'google-site-kit' ) }
		</Layout>
	) );
