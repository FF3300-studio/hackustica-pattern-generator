<script lang="ts">
  // Svelte imports
  import InputItem from "./InputItem.svelte";
  import InputFile from "./InputFile.svelte";

  // Stores with data
  import { PatternStore } from "../stores";

  // Functions & defs
  import { handleDraw } from "../ts/draw";
</script>

<!-- Radio buttons to select the thickness mode -->
<InputItem>
  <InputFile
    on:upload={(e) => {
      $PatternStore.thickness.imageUrl = e.detail.file;
      handleDraw();
    }}
  />
</InputItem>
