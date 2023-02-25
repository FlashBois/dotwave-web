<script lang="ts">
	import axios from 'axios';
    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';
    import 'chartjs-adapter-date-fns';
  
    let canvasElement: HTMLCanvasElement

    interface IPythHistory {
      timestamp: string,
      open_price: number,
      low_price: number,
      close_price: number,
      high_price: number,
      avg_price: number,
      avg_confidence: number,
      avg_emaPrice: number,
      start_slot: number,
      end_slot: number
    }
  
    onMount(async () => {
	    const cos = (await axios.get('https://web-api.pyth.network/history?symbol=Crypto.BTC/USD&range=1D&cluster=mainnet-beta')).data as IPythHistory[]

      console.log(cos)

      let ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
  
      let data = cos.map(e => {
        return {
          x: new Date(e.timestamp),
          y: e.avg_price
        }
      })
      
      const colors = {
        purple: {
          default: "rgba(149, 76, 233, 1)",
          half: "rgba(149, 76, 233, 0.70)",
          quarter: "rgba(149, 76, 233, 0.50)",
          zero: "rgba(149, 76, 233, 0)"
        },
        indigo: {
          default: "rgba(80, 102, 120, 1)",
          quarter: "rgba(80, 102, 120, 0.25)"
        }
      };
  
      const gradient = ctx.createLinearGradient(0, 25, 0, 500);
      gradient.addColorStop(0, colors.purple.half);
      gradient.addColorStop(0.30, colors.purple.quarter);
      gradient.addColorStop(1, colors.purple.zero);
  
      var chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            fill: true,
            backgroundColor: gradient,
            pointBackgroundColor: colors.purple.default,
            borderColor: colors.purple.default,
            data: data,
            borderWidth: 2,
            pointRadius: 0,
          }]
        },
        options: {
          animation: {
            easing: 'linear',
            duration: 1000,
            delay: 0
          },
          interaction: {
            intersect: false,
          },
          plugins: {
            legend: {
              display: false
            },
            subtitle: {
              display: false
            },
            title: {
              display: false
            }
          },
          scales: {
            x: {
              type: 'time',
              display: false,
            },
            y: {
              display: false,
              type: 'logarithmic',
            }
          }
        }
      });
    })
</script>

<div class="chart">
	<canvas bind:this={canvasElement} id="myChart" />
</div>

<style lang="scss">
	.chart {
		position: fixed;
		height: calc(100vh - 3rem);
    opacity: 0.8;

    bottom: 0;
    left: 0;

    canvas{
      height: 100%;
    }
	}
</style>
