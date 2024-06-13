
<script>
export default {
  props: {
    title: String,
    description: String,
    price: Number,
    images: Array
  },
  mounted() {
    console.log("House Details:");
    console.log("Title:", this.title);
    console.log("Description:", this.description);
    console.log("Price:", this.price);

  }
};
</script>
<template>
  <div class="house-details">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <p>Price: {{ price }}</p>
    <div v-if="Array.isArray(images)">
      <div v-for="(img, index) in images" :key="index">
        <img :src="img" alt="House Image" />
      </div>
    </div>
  </div>
</template>




<style scoped>
.house-details {
  position: relative;
  z-index: 1000; /* Adjust as necessary */
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
