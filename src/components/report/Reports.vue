<template>
  <div>
   <div id="main" style="width: 800px;height:600px;"></div>
  </div>
</template>
<script>
// 数据可视化
// 计算机图形：位图 矢量图
// 位图：像素图 放大会模糊 失真 优点：快 原理：把上一帧擦掉，再画一张 1秒30帧 掉帧 canvas（2d） webGL(过于复杂，不会自己去写) three.js 博物馆
// 矢量图：autocad ai 放大不会模糊 内存占用比较大 svg 用div画的东西很规则 当你想画一些不规则的图形的时候 常见的应用：字体图标 比较简单的动画

// highcharts 国外 收费
// echarts 百度出品
// antV 阿里


// openGL
import echarts from 'echarts'
export default {
  mounted(){
    this.initEcharts()
  },
  data () {
    return {

    };
  },
  methods:{
    initEcharts(){
      // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
    tooltip: {
        trigger: "axis"
    },
    legend: {
        data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
    },
    toolbox: {
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: true
            },
            magicType: {
                show: false,
                type: ["line", "bar", "stack", "tiled"]
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: true,
    xAxis: [
        {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            position: "bottom"
        }
    ],
    yAxis: [
        {
            type: "value"
        }
    ],
    series: [
        {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: "default"
                    }
                }
            },
            data: [110, 132, 101, 134, 90, 230, 210]
        },
        {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: "default"
                    }
                }
            },
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: "视频广告",
            type: "line",
            stack: "总量",
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: "default"
                    }
                }
            },
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: "直接访问",
            type: "line",
            stack: "总量",
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: "default"
                    }
                }
            },
            data: [320, 100, 301, 334, 390, 330, 320]
        },
        {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: "default"
                    }
                }
            },
            data: [820, 300, 901, 934, 1290, 1330, 1320]
        }
    ],
    title: {
        text: "主标题",
        subtext: "副标题",
        link: "http://baidu.com"
    },
    grid: {
        x2: 43,
        y2: 30
    }
}


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
  }
}
</script>
<style scoped lang="less">

</style>
