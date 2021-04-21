<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { nanoid } from "nanoid";

  let fileinput;

  const dispatch = createEventDispatcher();

  const onFileSelected = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      dispatch("upload", {
        file: e.target.result,
      });
    };
  };

  const id = nanoid(5);
</script>

<!-- <label for={id}>Seleziona un file</label> -->
<div class="container">
  <input
    {id}
    type="file"
    accept=".jpg, .jpeg, .png"
    on:change={(e) => onFileSelected(e)}
    bind:this={fileinput}
  />
</div>

<style>
  .container {
    overflow: hidden;
    height: var(--input-h);
  }
</style>
