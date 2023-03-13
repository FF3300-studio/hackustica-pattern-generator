<script lang="ts">
  /* --- Imports --- */

  // Stores with data
  import { PatternStore } from "./stores";

  // Svelte imports
  import InputGroup from "./components/InputGroup.svelte";
  import InputItem from "./components/InputItem.svelte";
  import InputInteger from "./components/InputInteger.svelte";
  import InputAlphabet from "./components/InputAlphabet.svelte";

  import { draw } from "./ts/draw";
  import { downloadSVG, downloadPNG } from "./ts/download";
  import InputFile from "./components/InputFile.svelte";
</script>

<main>
  <!--  -->

  <!-- Input -->
  <div class="input">
    <div>
      <!-- Canvas -->
      <div class="btns">
        <button class="button-main w-100" on:click={draw}>Disegna!</button>
        <div class="buttons-download">
          <button class="button-main btn-flex" on:click={downloadSVG}
            >↓ SVG</button
          >
          <button class="button-main btn-flex" on:click={downloadPNG}
            >↓ PNG</button
          >
        </div>
      </div>

      <!-- Canvas -->
      <InputGroup label={"Tavola disegno"}>
        <!--  -->
        <InputItem>
          <InputInteger
            label="Larghezza"
            bind:value={$PatternStore.canvas.width}
          />
        </InputItem>
        <!--  -->
        <InputItem>
          <InputInteger
            label="Altezza"
            bind:value={$PatternStore.canvas.height}
          />
        </InputItem>
        <!--  -->
      </InputGroup>

      <!-- Grid -->
      <InputGroup label={"Griglia"}>
        <!--  -->
        <InputItem>
          <InputInteger label="Righe" bind:value={$PatternStore.grid.rows} />
        </InputItem>
        <!--  -->
        <InputItem>
          <InputInteger
            label="Colonne"
            bind:value={$PatternStore.grid.columns}
          />
        </InputItem>
      </InputGroup>

      <!-- Thicknesses -->
      <InputGroup label={"Immagine"}>
        <InputItem>
          <InputFile
            on:upload={(e) => {
              $PatternStore.thickness.imageUrl = e.detail.file;
            }}
          />
        </InputItem>
      </InputGroup>
      <!-- Thicknesses -->
      <InputGroup label={"Alfabeti"}>
        <InputItem>
          <InputAlphabet bind:alfabeti={$PatternStore.alphabets} />
        </InputItem>
      </InputGroup>
    </div>
  </div>

  <!-- Debug -->
  <!-- <pre
    style="overflow:auto">
      {JSON.stringify($PatternStore, null, 4)}
    </pre> -->

  <!-- Output -->
  <div id="output" />

  <!--  -->
</main>

<style>
  main {
    display: flex;
    flex-flow: row nowrap;
    height: 100vh;
  }

  .input {
    flex-shrink: 0;
    width: 350px;
    background-color: var(--cds-ui-background);
    overflow: auto;
    padding: 0 var(--aria);
    padding-bottom: var(--aria);
  }

  #output {
    flex-grow: 1;
    background-color: var(--cds-text-01);
    overflow: auto;
    /* overflow: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center; */
  }

  button {
    display: block;
    width: 100%;
  }

  .btns {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    background-color: var(--cds-ui-background);
    padding: var(--aria) 0;
    z-index: 1000;
  }

  .button-main {
    margin-bottom: calc(var(--aria) / 2);
  }

  .button-main:last-child {
    margin-bottom: 0;
  }

  .buttons-download {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }

  .buttons-download > * + * {
    margin-left: calc(var(--aria) / 2);
  }
</style>
