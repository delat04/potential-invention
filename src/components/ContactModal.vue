<script setup>
</script>



<template>
  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-modal-content">
        <div class="modal-header custom-modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Contact Us</h1>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="text-center">
            <img src="/images/contact-us.png" alt="no image" class="modal-image">
            <h3>Welcome to Copedia Team!</h3>
            <p style="font-family: 'Reddit Mono',serif">At Copedia, we are dedicated to helping you achieve excellence. Our team is committed to providing top-notch support and guidance to ensure your success. Feel free to reach out to us for any assistance you may need.</p>
            <h3 style="font-family: 'Reddit Mono',serif"><i class="bi bi-telephone" style="font-size:1.1em "></i> Contact us at: +216 993352555</h3>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-modal-content {

  background: #ffffff;
  border: none;
  border-radius: 66px;
  color: #000000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.custom-modal-header {
  border-bottom: 1px solid #ffffff;
  background: #ffffff;
  color: #000000;
}

.btn-close {
  filter: invert(1);
}

.modal-image {
  width: 100px;
  margin-bottom: 20px;
}

.modal-body {
  background: #ffffff;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
}

p {
  color: #000000;
}

h3 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
