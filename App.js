import React,{useState} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, AppRegistry, Share, Platform, Clipboard } from 'react-native';
import * as Animatable from 'react-native-animatable';
let fetch = require('node-fetch')

//web api to get random quotes
let web_url = ['https://official-joke-api.appspot.com/jokes/random','https://api.adviceslip.com/advice', 'https://api.chucknorris.io/jokes/random', 'https://quote-garden.herokuapp.com/quotes/random']

//all the type of amin
let amin = ['bounceIn', 'bounceInDown', 'bounceInUp', 'bounceInLeft', 'bounceInRight', 'fadeIn', 'fadeInDown', 'fadeInUp', 'fadeInLeft', 'fadeInRight', 'flipInX', 'flipInY', 'lightSpeedIn', 'zoomIn', 'zoomInDown', 'zoomInUp', 'zoomInLeft', 'zoomInRight', 'bounce', 'flash', 'jello', 'pulse', 'rotate', 'rubberBand', 'shake', 'shake', 'tada', 'wobble']

//random
function rand(num){
  let x = Math.floor(Math.random()*num)
  return x
}

//Main App Code
export default function App() {
  const [data_me, set_data] = useState({line:1, text:'Click Here To Begin Your Adventure'})//quote data
  const [like_btn, set_like_btn] = useState(require('./Image_btn/normal_like.png'))//the like btn
  let raw_data = ''//var to move data to data_me
  let if_press_already = false //to stop spamming the quote btn

  //App share btn
  async function share_text_btn(){
    let data_new_share = ''
    if(data_me.line == 1){
      data_new_share = data_me.text
    }else if(data_me.create != undefined){
      data_new_share = data_me.text_1 + 'By ' + data_me.text_2
    }else{
      data_new_share = data_me.text_1 + ' ' + data_me.text_2
    }
    await Share.share({message: data_new_share})
  }

  //web share btn
  function share_clip(){
    let data_new_share = ''
    if(data_me.line == 1){
      data_new_share = data_me.text
    }else if(data_me.create != undefined){
      data_new_share = data_me.text_1 + 'By ' + data_me.text_2
    }else{
      data_new_share = data_me.text_1 + ' ' + data_me.text_2
    }
    Clipboard.setString(data_new_share)
    alert('Text has been copy')
  }

  //what share btn to use with the OS
  function Btn_will_share(){
    if(Platform.OS === 'web'){
      return <View style={{paddingLeft:80}}>
      <TouchableOpacity onPress={share_clip}>
        <Image style={{width:40, height:40}} source={require('./Image_btn/share.png')}/>
      </TouchableOpacity>
      </View> 
    }else{
      return <View style={{paddingLeft:80}}>
      <TouchableOpacity onPress={share_text_btn}>
        <Image style={{width:40, height:40}} source={require('./Image_btn/share.png')}/>
      </TouchableOpacity>
      </View>
    }
  }

  //simple like btn
  function like_btn_press(press_me){
    if(press_me == 'like'){
      let img_btn = require('./Image_btn/click_icon.png')
      set_like_btn(img_btn)
    }else{
      let img_btn = require('./Image_btn/normal_like.png')
      set_like_btn(img_btn)
    }
  }

  //display quote onto screen
  function Create_quote_btn_single(){
    let r = rand(amin.length)
    if(data_me.line == 1){
      if_press_already = false
      return <Animatable.View animation={amin[r]}><TouchableOpacity onPress={random_quote}><Text style={styles.text}>{data_me.text}</Text></TouchableOpacity></Animatable.View>
    }else if(data_me.create != undefined){
      if_press_already = false
      return <Animatable.View animation={amin[r]}><TouchableOpacity onPress={random_quote}><Text style={styles.text}>{data_me.text_1}</Text><Text style={styles.text_bottom}>By {data_me.text_2}</Text></TouchableOpacity></Animatable.View>
    }else{
      if_press_already = false
      return <Animatable.View animation={amin[r]}><TouchableOpacity onPress={random_quote}><Text style={styles.text}>{data_me.text_1}</Text><Text style={styles.text_bottom}>{data_me.text_2}</Text></TouchableOpacity></Animatable.View>
    }
  }

  //break down the quote from the web data
  function break_down(data,ran){
    if(web_url[ran] == 'https://official-joke-api.appspot.com/jokes/random'){
      raw_data = {
        text_1: data.setup,
        text_2: data.punchline,
        line: 2
      }
      //console.log(raw_data)
    }
    if(web_url[ran] == 'https://api.adviceslip.com/advice'){
      raw_data = {
        text: data.slip.advice,
        line: 1
      }
      //console.log(raw_data)
    }
    if(web_url[ran] == 'https://api.chucknorris.io/jokes/random'){
      raw_data = {
        text: data.value,
        line: 1
      }
      //console.log(raw_data)
    }
    if(web_url[ran] == 'https://quote-garden.herokuapp.com/quotes/random'){
      raw_data = {
        text_1: data.quoteText,
        text_2: data.quoteAuthor,
        line: 2,
        create: true
      }
      //console.log(raw_data)
    }
    set_data(raw_data)
    like_btn_press('normal')
  }

  //random get a quote from the web links
  async function random_quote(){
    if(if_press_already == false){
      if_press_already = true
      let r = rand(web_url.length)
      //console.log(web_url[r])
      await fetch(web_url[r],{method: 'GET'}).then(function(res){
        return res.json()
      }).then(function(data){
          //console.log(data)
          break_down(data,r)
      })
    }
  }

  return (
    <View style={styles.container}>
      <View style={{paddingTop:25, alignItems:'center'}}>
        <Text style={styles.big_text}>F r o h</Text>
      </View>
      <View style={styles.qoute}>
          <Create_quote_btn_single/>
      </View>
      <View style={{flex:2, alignSelf:'center', position:'absolute' ,bottom:50}}>
      <View style={styles.btn_area}>
        <View>
        <TouchableOpacity onPress={function(){like_btn_press('like')}}>
          <Image style={{width:40, height:40}} source={like_btn}/>
        </TouchableOpacity>
        </View>
        <Btn_will_share/>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: StatusBar.currentHeight,
    padding:14
  },
  text:{
    color:'#ffff',
    fontSize:18,
    textAlign:'center'
  },
  text_bottom:{
    color:'#ffff',
    fontSize:18,
    textAlign:'center',
    paddingTop:10
  },
  big_text:{
    color:'#6e6e6e',
    fontSize: 27,
    fontWeight:'600'
  },
  qoute:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    alignContent:'center',
    paddingBottom:150
  },
  btn_area:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-evenly',
    bottom:60,
    padding: 10,
    paddingTop:100
  }
});

AppRegistry.registerComponent('App', function(){App})
