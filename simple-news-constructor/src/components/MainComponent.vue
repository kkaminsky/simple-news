<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex md12>
        <v-container fluid>
          <v-layout row>
            <v-flex md2 offset-md3>
              <v-combobox
                :items="fields"
                v-model="selectedField"
                :background-color="colorCategory[selectedField].split(':')[1]"
                label="Выберите категорию"
              >

              </v-combobox>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex md6 offset-md3>
              <v-combobox
                v-model="selectedTags"
                :items="tags"
                chips
                multiple
                label="#Теги"
              >
                <template v-slot:selection="data">
                  <v-chip
                    :key="JSON.stringify(data.item)"
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    :disabled="data.disabled"
                    @click.stop="data.parent.selectedIndex = data.index"
                    @click:close="data.parent.selectItem(data.item)"
                  >
                    <v-avatar class="accent white--text" left>
                      {{ data.item.slice(0, 1).toUpperCase() }}
                    </v-avatar>
                    {{ data.item }}
                  </v-chip>
                </template>
              </v-combobox>
            </v-flex>

          </v-layout>
          <v-layout row>
            <v-flex md8 offset-md2>
              <v-textarea v-model="shortText" rows="3" label="Описание новости" row-height="40" class="styled-input2" >

              </v-textarea>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex md2>
              <v-card v-for="item in colorLegends" class="mt-3 mr-5">
                <v-list-item  :style="item.style">
                  <v-list-item-content>
                    <v-list-item-title>{{item.name}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-flex>
            <v-flex  md4>
              <highlightable-input v-model="highlightText"
                                   highlight-style="background-color:yellow"
                                   :highlight-enabled="highlightEnabled"
                                   :highlight="highlight"
                                   labe="ddsf"
              class="styled-input" >

              </highlightable-input>

              <v-dialog
                v-model="dialog"
                max-width="290"
              >
                <v-card>
                  <v-card-title class="headline">Выберите синоним</v-card-title>

                  <v-card-text>
                    <v-combobox :items="wordsSynonim"
                    v-model="selectedWordSynonim"
                                background-color="#f37373"
                    >

                    </v-combobox>
                  </v-card-text>

                  <v-card-actions>
                    <div class="flex-grow-1"></div>

                    <v-btn

                      text
                      @click="dialog = false"
                    >
                      Назад
                    </v-btn>

                    <v-btn

                      text
                      @click="closeDialog"
                    >
                      Ок
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </v-flex>

            <v-flex md4>
              <p style="text-align: right"> Новости по теме</p>
              <v-card v-for="news in oftherNews">
                <v-list-item class="mt-3">
                  <v-list-item-content>
                    <v-list-item-title>{{news}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex md3 offset-md2>
              <v-combobox label="Не использованные ключевые слова по данной категории и тексту"
                          disabled="true"
                          v-model="keywordsOutText"
                          :items="keywordsOutText"
                          chips
                          multiple>
                <template v-slot:selection="data">
                  <v-chip
                    :key="JSON.stringify(data.item)"
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    :disabled="data.disabled"
                    @click.stop="data.parent.selectedIndex = data.index"
                    @click:close="data.parent.selectItem(data.item)"
                  >
                    <v-avatar class="accent white--text" left>
                      {{ data.item.slice(0, 1).toUpperCase() }}
                    </v-avatar>
                    {{ data.item }}
                  </v-chip>
                </template>


              </v-combobox>
            </v-flex>
            <v-flex md1  style="text-align: right">
              <v-btn @click="getTags" text class="mt-3">
                Анализ
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row class="mt-12 mb-9">
            <v-flex md3 offset-md2>
              <apexchart type=donut width=380 :options="chartOptions1" :series="series1" />
            </v-flex>
            <v-flex md2>
              <apexchart type=pie width=380 :options="chartOptions2" :series="series2" />
            </v-flex>

          </v-layout>
          <v-layout row>
            <v-flex>
              <carousel-3d @after-slide-change="onAfterSlideChange" width="600" height="400">
                <slide v-for="(slide, i) in slides" :index="i" :key="i">
                  <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
                    <img :data-index="index" :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0) }" :src="slide.url">
                  </template>
                </slide>
              </carousel-3d>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex md12 center style="text-align: center">
              <v-btn text @click="postInVK">
                Запостить
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { Carousel3d, Slide } from 'vue-carousel-3d';
  import HighlightableInput from "vue-highlightable-input";
  import $ from "jquery"
    export default {
      components: {
        Carousel3d,
        Slide,
        HighlightableInput
      },
        name: "MainComponent",
      methods:{
        getTags(){
          this.getShortText()
          this.$http.post("/api1/keywords",{
            text:this.highlightText,
            count:15
          }).then(res=>{
            this.tags = res.data
            this.selectedTags = this.tags
            this.getPhotos()
            this.getShortText()
            this.getWordsCategories()
            this.getRates()
          })
        },
        getShortText(){
          this.$http.post("/api1/summ",{
            text:this.highlightText
          }).then(res=>{
            this.shortText = res.data.summ

          })

        },
        getPhotos(){
          let i;
          let str = "";
          for(i=0;i<1;i++){
            str+=" " + this.tags[i]

          }
          str =   str.replace(':','').trim()

          this.$http.post("/api2/photo",{
            "query": str
          }).then(res=>{
            this.slides = res.data
            this.oftherNews = res.data.map(o=>o.text)
            console.log(res.data)
          })
        },
        onAfterSlideChange(index){
          this.currentIndex = index
          console.log(index)
        },
        postInVK(){
          this.$http.post("/api2/wallPost",{
            message: this.highlightText,
            url: this.slides[this.currentIndex].url
          })

        },
        getRates(){
          this.$http.post("/api1/predict",{
            text:this.highlightText
          }).then(res=>{
            this.series2 = Object.values(res.data.mapOfPrediction)
          })

        },
        closeDialog(){
          this.dialog = false
          //this.highlightText = this.highlightText.replace(this.innerText,this.selectedWordSynonim)
          this.targetWord.innerHTML = "<span>" + this.selectedWordSynonim.split('-')[0] + "</span>"
        },
        getWordsCategories(){
          let vm = this
          this.$http.post("/api1/category",{
            text: this.highlightText
          }).then(res=>{
            let object = {}

            for(let prop in this.colorCategory){
              object[this.colorCategory[prop].split(':')[1]]=0
            }

            console.log(res.data)

            let resultArray = []
            for(let prop in res.data){
              object[this.colorCategory[res.data[prop]].split(":")[1]]+=1
              resultArray.push({
                text:prop,
                style:this.colorCategory[res.data[prop]]
              })
            }

            console.log(resultArray)

            console.log(object)

            this.series1 = Object.values(object)
            console.log(Object.values(object))
            this.chartOptions1.colors = Object.keys(object)
            console.log(Object.keys(object))

            this.highlight = resultArray
          })
        }


      },
      data(){
        return{
          wordsSynonim:[],
          selectedWordSynonim:"",
          dialog: false,
          keywordsOutText:["слово 1","слово 2"],
          selectedKeywordsOutText:[],
          tags:[],
          currentIndex: 0,
          fields:["Разное",
            "Спорт",
            "Общество",
            "Работа",
            "Здоровье",
            "Культура",
            "Технологии",
            "Образование"],
          selectedField:"",
          slides:[{
            text:"",
            url: "https://avatanplus.com/files/resources/mid/5a3641896175916063f000b7.jpg"
          },
            {
              text:"",
              url: "https://avatanplus.com/files/resources/mid/5a3641896175916063f000b7.jpg"
            },
            {
              text:"",
              url: "https://avatanplus.com/files/resources/mid/5a3641896175916063f000b7.jpg"
            },
            {
              text:"",
              url: "https://avatanplus.com/files/resources/mid/5a3641896175916063f000b7.jpg"
            },
            {
              text:"",
              url: "https://avatanplus.com/files/resources/mid/5a3641896175916063f000b7.jpg"
            }
          ],
          shortText:"",
          selectedTags:[],
          oftherNews:["",
          "",
          ""],
          highlight: [
            {text:'chicken', style:"background-color:#f37373"},
            {text:'noodle', style:"background-color:#fca88f"},
            {text:'soup', style:"background-color:#bbe4cb"},
            {text:'so', style:"background-color:#fff05e"},
            "whatever"
           /* {start: 2, end: 5, style:"background-color:#f330ff"}*/
          ],
          colorCategory:{
            "Разное":"background-color:#f37373",
            "Спорт":"background-color:#fca88f",
            "Культура":"background-color:#bbe4cb",
            "Общество":"background-color:#fff05e",
            "Работа":"background-color:#f330ff",
            "Здоровье":"background-color:#cf228a",
            "Технологии":"background-color:#a37e6d",
            "Образование": "background-color:#125317",
            "":"background-color:#ffffff"
          },
          highlightEnabled: true,
          highlightText:"Каждая история уникальна...",
          newsText:[
            "dsfsdfdsfsdfdsfsdfdsfsdfdsfsdfdsfsdfdsfsdf",
            "dsfdsf",
            "sdfsdfsdf",
            ""
          ],
          colorLegends:[],
          series2: [],
          chartOptions2: {
            colors: ['#808080','#f3f2f2'],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          },
          series1: [],
          word:"",
          targetWord:"",

          chartOptions1: {
            dataLabels: {
              enabled: false
            },

            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  show: false
                }
              }
            }],
            legend: {
              position: 'right',
              offsetY: 0,
              height: 230,
            }
          }
        }
      },
      created() {
        let vm = this
        this.selectedTags = this.tags
        this.$vuetify.theme.themes.light.primary = '#808080'
        this.$vuetify.theme.themes.light.secondary = '#808080'
        this.$vuetify.theme.themes.light.accent = '#808080'
        /*let span = document.querySelector('.span')*/
        $('body').on('click', '.container > div > div > div > span', function(event) {
          vm.dialog = true

          console.log(event.target.innerText)
          this.targetWord = event.target
          vm.$http.post("/api1/synonim",{
            text:event.target.innerText
          }).then(res=>{
            console.log(res)
            vm.wordsSynonim = []
            for(let prop in res.data[event.target.innerText]){
              vm.wordsSynonim.push(prop +"-" + (res.data[event.target.innerText])[prop])
            }
            console.log(vm.wordsSynonim)
          })

        })
        for(let prop in this.colorCategory){
          this.colorLegends.push({
            name: prop,
            style: this.colorCategory[prop]
          })
        }

      }
    }
</script>

<style scoped>
  .styled-input{
    height: 400px;
    font-size: 15pt;

  }
  .styled-input:focus {
    outline: none !important;
    border:1px solid gray;
    box-shadow: 0 0 10px gray;
  }
  .styled-input2{
    font-size: 17pt;

  }

</style>
