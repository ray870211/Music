<template>
  <div class="col-span-1">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Upload</span>
        <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
          :class="{
            'bg-green-400 text-white border-green-400 border-solid':
              isDragActive,
          }"
          @drag.prevent.stop=""
          @dragstart.prevent.stop=""
          @dragend.prevent.stop="isDragActive = false"
          @dragover.prevent.stop="isDragActive = true"
          @dragenter.prevent.stop="isDragActive = true"
          @dragleave.prevent.stop="isDragActive = false"
          @drop.prevent.stop="upload($event)"
        >
          <h5>Drop your files here</h5>
        </div>
        <input type="file" multiple />
        <hr class="my-6" />
        <div class="mb-4" v-for="upload in uploads" :key="upload.name">
          <div class="font-bold text-sm">{{ upload.name }}</div>
          <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
            <div
              class="transition-all progress-bar bg-blue-400"
              :class="{
                'bg-red-400': upload.error,
                'bg-green-400': upload.complete,
              }"
              :style="{ width: upload.current_progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { storage, auth, songsCollection } from "@/includes/firebase";
export default {
  name: "Upload",
  data() {
    return {
      isDragActive: false,
      uploads: [],
    };
  },
  props: ["addSong"],
  methods: {
    upload($event) {
      this.isDragActive = false;

      const files = $event.dataTransfer
        ? [$event.dataTransfer.files[0]]
        : [...$event.target.files];
      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          console.log("not mp3");
          return;
        }
        const storageRef = storage.ref(); //music-510d4.appspot.com"
        console.log(file.name);
        const songsRef = storageRef.child(`songs/${file.name}`); //music-510d4.appspot.com/songs/example.mp3
        const task = songsRef.put(file);

        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            error: false,
          }) - 1;

        task.on(
          "state_changed",
          (snapshot) => {
            const percentage =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].current_progress = percentage;
          },
          (error) => {
            // Handle unsuccessful uploads
            this.uploads[uploadIndex].error = true;
            console.log(error);
          },
          async () => {
            // Handle successful uploads on complete
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: "",
              comment_count: 0,
            };
            song.url = await task.snapshot.ref.getDownloadURL();
            const songRef = await songsCollection.add(song);
            const songsSnapshot = await songRef.get();

            this.addSong(songsSnapshot);
          }
        );
      });
      console.log(files);
    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
};
</script>
