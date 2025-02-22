import { registerTheme, init } from 'echarts';
import { evidenceThemeLight } from './echartsThemes';
import debounce from 'debounce';

/**
 * @typedef {import("echarts").EChartsOption & {
 * 		dispatch?: ReturnType<typeof import("svelte").createEventDispatcher>;
 * 		showAllXAxisLabels?: boolean;
 * 	}
 * } ActionParams
 */

/** @type {import("svelte/action").Action<HTMLElement, ActionParams>} */
export default (node, option) => {
	registerTheme('evidence-light', evidenceThemeLight);

	const chart = init(node, 'evidence-light', { renderer: 'canvas' });

	chart.setOption(option);

	const dispatch = option.dispatch;
	chart.on('click', function (params) {
		dispatch('click', params);
	});

	let resizeObserver;
	const containerElement = document.querySelector('div.content > article');
	const onWindowResize = debounce(() => {
		chart.resize({
			animation: {
				duration: 500
			}
		});
		updateLabelWidths();
	}, 100);

	const updateLabelWidths = () => {
		// Make sure we operate on an up-to-date options object
		/** @type {import("echarts").EChartsOption} */
		const prevOption = chart.getOption();
		if (!prevOption) return;
		// If the options object includes showing all x axis labels
		// Note: this isn't a standard option, but right now this is the easiest way to pass something to the action.
		// We don't want to have multiple resize observers if we can avoid it, and this is all due for a cleanup anyways
		if (prevOption.showAllXAxisLabels) {
			// Get all the possible x values
			const distinctXValues = new Set(prevOption.series.flatMap((s) => s.data?.map((d) => d[0])));
			const modConst = 4 / 5;
			const clientWidth = node?.clientWidth ?? 0;

			// We disable this behavior because it doesn't make sense on horizontal bar charts
			// Category labels will grow to be visible
			// Value labels are interpolatable anyway
			if (!option.swapXY) {
				/** @type {import("echarts").EChartsOption} */
				const newOption = {
					xAxis: {
						axisLabel: {
							interval: 0,
							overflow: 'truncate',
							width: (clientWidth * modConst) / distinctXValues.size
						}
					}
				};
				chart.setOption(newOption);
			}
		}
	};

	if (window.ResizeObserver && containerElement) {
		resizeObserver = new ResizeObserver(onWindowResize);
		resizeObserver.observe(containerElement);
	} else {
		window.addEventListener('resize', onWindowResize);
	}

	onWindowResize();

	return {
		update(option) {
			chart.setOption(option, true, true);
			updateLabelWidths();
		},
		destroy() {
			if (resizeObserver) {
				resizeObserver.unobserve(containerElement);
			} else {
				window.removeEventListener('resize', onWindowResize);
			}
			chart.dispose();
		}
	};
};
