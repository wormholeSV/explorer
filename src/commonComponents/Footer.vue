<template lang="pug">
    div.footer-container
        div.footer-box
                img(src="../../public/img/whormhole_logo_bottom.png" alt="logo" class='logo')
                div.line
                div.social-content
                    div.item-body
                        a(href="https://medium.com/@wormholecash" target="_blank")
                            div(class='item-container')
                                span(class='icon-medium icon-item')
                                span(class='name') Medium
                    div.item-body
                        a(href="https://twitter.com/WormholeCash" target="_blank")
                            div(class='item-container')
                                span(class='icon-twitter icon-item')
                                span(class='name') Twitter
                    div.item-body
                        a(href="https://t.me/joinchat/ExB1tQ-vgIZxFmA749z2nA" target="_blank")
                            div(class='item-container')
                                span(class='icon-telegram icon-item')
                                span(class='name') Telegarm
                    div.item-body
                        a(href="https://wormholetech.slack.com/join/shared_invite/enQtNDU4MTUyODgxMTg2LTEwNDE4NzhiOWVmYTE4MmI0OWMyODA4MWE5ODFkYTJkNzhkMGZlNGYwZTAyYzRmOTc1ZDdlOWE2NWVlNzRlNzY" target="_blank")
                            div(class='item-container')
                                span(class='icon-slack icon-item')
                                span(class='name') Slack
                div(class="copy-footer") © 2018 wormhole.cash
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {

  },
  computed: {

  },
  created () {
  },
  mounted () {

  }
}
</script>

<style lang="scss">
.footer-container{
    margin-top: 20px;
    background-image: linear-gradient(to top, #0a1235, #1a2a5c);
    .footer-box{
        box-sizing: border-box;
        width: 1216px;
        margin: 0 auto;
        padding: 40px 0 50px 0;
        .logo{
           width: 500px;
           opacity: 0.18;
        }
        .line{
            width: 100%;
            height: 1px;
            background-color: rgba(255,255,255,.1);
            margin-top: 40px;
        }
        .social-content{
            display: flex;
            margin-top: 50px;
            .item-body{
                flex: 1;
                justify-content: center;
                .item-container{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .name{
                    margin-left: 14px;
                    font-size: 18px;
                    color: #fff;
                    text-decoration: none;
                }
            }
        }
        .icon-item{
            display: inline-block;
            background-size: contain;
            width: 30px;
            height: 30px;
            background-repeat: no-repeat;
        }
        .icon-slack{
            background-image: url(../../public/img/icon_slack.png);
        }
        .icon-telegram{
            background-image: url(../../public/img/icon_telegram.png);
        }
        .icon-twitter{
            background-image: url(../../public/img/icon_twitter.png);
        }
        .icon-medium{
            background-image: url(../../public/img/icon_medium.png);
        }
        .copy-footer{
            margin-top: 40px;
            color: rgba(255,255,255,.3)
        }
    }
    a, a:link, a:visited, a:focus, a:hover, a:active{
    text-decoration:none;
    }
}
</style>
