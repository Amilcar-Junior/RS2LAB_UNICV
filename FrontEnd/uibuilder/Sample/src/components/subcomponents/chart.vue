<template>
    <b-container>
        <b-row b-row align-h="center" style="margin-top:5%;">
            <b-col cols="5" >
                <canvas ref="c3" style="width:40%">
                </canvas>
            </b-col>
            <b-col cols="5" >
                <b-container>
                    <b-row>
                        <b-col>
                            <canvas ref="c4" style="width:100%"/>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <canvas ref="c5" style="width:100%"/>
                        </b-col>
                    </b-row>
                </b-container>
            </b-col>
        </b-row>
    </b-container>
</template>
<style scoped>

</style>
<script>
module.exports = {
    data() {
        return {};
    },
    mounted(){
        this.renderchart();
    },
    methods:{
        renderchart(){

            var contex = contex = this.$refs["c3"].getContext("2d");
           new Chart(contex, {
                type: 'doughnut',
                data: {
                labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
                datasets: [
                    {
                    label: "Population (millions)",
                    backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                    data: [2478,5267,734,784,433]
                    }
                ]
                },
                options: {
                title: {
                    display: true,
                    text: 'Predicted world population (millions) in 2050'
                }
                }
            });

            contex = this.$refs["c4"].getContext("2d");
            new Chart(contex, {
                            type: 'bar',
                            data: {
                            labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
                            datasets: [
                                {
                                label: "Population (millions)",
                                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                                data: [2478,5267,734,784,433]
                                }
                            ]
                            },
                            options: {
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: 'Predicted world population (millions) in 2050'
                                }
                            }
            });

            contex = this.$refs["c5"].getContext("2d");
           new Chart(contex, {
                type: 'line',
                data: {
                    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
                    datasets: [{ 
                        data: [86,114,106,106,107,111,133,221,783,2478],
                        label: "Africa",
                        borderColor: "#3e95cd",
                        fill: false
                    }, { 
                        data: [282,350,411,502,635,809,947,1402,3700,5267],
                        label: "Asia",
                        borderColor: "#8e5ea2",
                        fill: false
                    }, { 
                        data: [168,170,178,190,203,276,408,547,675,734],
                        label: "Europe",
                        borderColor: "#3cba9f",
                        fill: false
                    }, { 
                        data: [40,20,10,16,24,38,74,167,508,784],
                        label: "Latin America",
                        borderColor: "#e8c3b9",
                        fill: false
                    }, { 
                        data: [6,3,2,2,7,26,82,172,312,433],
                        label: "North America",
                        borderColor: "#c45850",
                        fill: false
                    }
                    ]
                },
                options: {
                    title: {
                    display: true,
                    text: 'World population per region (in millions)'
                    }
                }
                });

        }
    }, 
}
</script>
