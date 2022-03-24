<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <div class="sidebar">
      <div class="header">
        <div class="mask"></div>
        <div class="logo">Pic<span>Hub</span></div>
      </div>
      <div class="folder">
        <div v-for="(item, index) in new Array(40)" :key="index" class="item">
          文件夹{{ index }}
        </div>
      </div>
    </div>
    <div class="main">
      <div class="list">
        <div v-for="(item, index) in new Array(30)" :key="index" class="item">
          <div class="more"></div>
          <div class="info">测试文档.jpg</div>
        </div>
      </div>
      <div class="footer">231张图片</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  .sidebar {
    width: 200px;
    border-right: 1px rgb(226, 225, 225) solid;
    box-sizing: border-box;
    height: 100vh;
    overflow-y: scroll;
    .header {
      position: fixed;
      left: -1px;
      height: 70px;
      width: 200px;
      display: flex;
      z-index: 99;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
      border-bottom: 1px rgb(226, 225, 225) solid;

      .mask {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: rgb(255, 255, 255);
        filter: blur(1px);
        z-index: -1;
      }
      .logo {
        position: relative;
        font-size: 26px;

        font-weight: bolder;
        span {
          background: rgb(238, 177, 64);
          color: #000;
          border-radius: 2px;
          padding: 0px 3px;
          margin-left: 4px;
        }
      }
    }
    .folder {
      margin-top: 70px;
      padding: 10px;
      background: rgb(246, 246, 246);
      .item {
        position: relative;
        display: flex;
        align-items: center;
        height: 40px;
        box-sizing: border-box;
        padding: 0px 0px 0px 20px;
        transition: all 0.25s;
        color: #666;
        background: #fff;
        cursor: pointer;
      }
      .item::after {
        position: absolute;
        bottom: 0px;
        left: 20px;
        content: '';
        height: 1px;
        width: 150px;
        background: rgb(246, 246, 246);
      }
      .item:first-child {
        border-radius: 10px 10px 0px 0px;
      }
      .item:last-child {
        border-radius: 0px 0px 10px 10px;
      }
      .item:hover {
        color: #000;
        background: #fff;
      }
    }
  }
  .main {
    position: relative;
    width: calc(100vw - 200px);
    height: 100vh;
    overflow-y: auto;

    padding: 15px;
    box-sizing: border-box;
    .list {
      display: grid;
      grid-gap: 15px;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      list-style: none;
      padding-bottom: 50px;
      .item {
        position: relative;
        height: 0;
        padding-bottom: 100%;
        background: rgb(243, 243, 243);
        margin-bottom: 0px;
        border-radius: 10px;
        border: 1px rgba(231, 230, 230, 0) solid;
        box-shadow: 0px 2px 5px rgba(247, 245, 245, 0);
        overflow: hidden;

        .more {
          position: absolute;
          right: 5px;
          top: 5px;
          width: 30px;
          height: 30px;
          border-radius: 5px;
          background: #fff;
          opacity: 0;
          transition: all 0.25s;
          border: 1px rgb(231, 230, 230) solid;
          box-shadow: 0px 3px 5px rgb(226, 225, 225);
        }
        .info {
          position: absolute;
          left: 0px;
          bottom: 0px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          transition: all 0.25s;
          color: #999;
          width: 100%;
          font-size: 13px;
        }
      }
      .item:hover {
        border: 1px rgb(231, 230, 230) solid;
        box-shadow: 0px 2px 5px rgb(247, 245, 245);
        .info {
          background-color: #fff;
          color: #000;
        }
        .more {
          opacity: 1;
        }
      }
    }

    .footer {
      position: fixed;
      bottom: 0px;
      left: 0px;
      width: calc(100% - 200px);
      margin-left: 200px;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      text-align: center;
      color: #999;
      border-top: 1px rgb(231, 230, 230) solid;
      box-shadow: 0px 2px 5px rgb(247, 245, 245);
      background: #fff;
    }
  }
}
</style>
