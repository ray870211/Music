<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <a class="text-white font-bold uppercase text-2xl mr-4" href="#">Music</a>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <li>
            <a class="px-2 text-white" href="#">Manage</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
//pinia方法
import { mapStores } from "pinia";
import useModalStore from "@/stores/modal";
export default {
  name: "AppHeader",
  computed: {
    //這樣會讓我們可以扣過
    ...mapStores(useModalStore),
  },
  methods: {
    toggleAuthModal() {
      //這裡的modalStore的modal名稱來源於在modal.js內取的名字加上Store
      this.modalStore.isOpen = !this.modalStore.isOpen;
    },
  },
};
</script>
