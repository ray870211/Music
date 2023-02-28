<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <AppUpload ref="upload" :addSong="addSong"></AppUpload>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <CompositionItem
              v-for="(song, i) in songs"
              :key="song.id"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppUpload from "@/components/Upload.vue";
import { songsCollection, auth } from "@/includes/firebase";
import CompositionItem from "@/components/CompositionItem.vue";
export default {
  name: "manage",
  components: {
    AppUpload,
    CompositionItem,
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    const user = await auth.currentUser;
    const songsSnapshot = await songsCollection
      .where("uid", "==", user.uid)
      .get();
    songsSnapshot.forEach(this.addSong);
  },

  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    //accepts a document snapshot
    addSong(doc) {
      const song = {
        ...doc.data(),
        id: doc.id,
      };
      this.songs.push(song);
    },
    updateUnsavedFlag(values) {
      this.unsavedFlag = values;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const answer = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (answer) {
        next();
      } else {
        next(false);
      }
    }
  },
};
</script>
