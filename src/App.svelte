<script lang="ts">
  /* --- Imports --- */

  // Stores with data
  import { PatternStore, TextStore } from "./stores";

  // Svelte imports
  import InputGroup from "./components/InputGroup.svelte";
  import InputItem from "./components/InputItem.svelte";
  import InputInteger from "./components/InputInteger.svelte";
  import InputBool from "./components/InputBool.svelte";
  import InputFloat from "./components/InputFloat.svelte";
  import InputColor from "./components/InputColor.svelte";
  import InputThickness from "./components/InputThickness.svelte";

  // TS / Logic imports
  import { Tiles } from "./ts/defs";

  import { draw, handleDraw } from "./ts/draw";
  import { downloadSVG, downloadPNG, downloadGIF } from "./ts/download";

  window.onload = function () {
    draw();
  };
</script>

<main>
  <!--  -->

  <!-- Input -->
  <div class="input">
    <div>
      <!-- Canvas -->
      <div class="btns">
        <button class="button-main w-100" on:click={handleDraw}>Disegna!</button
        >
        <div class="buttons-download">
          <button class="button-main btn-flex" on:click={downloadSVG}
            >↓ SVG</button
          >
          <button class="button-main btn-flex" on:click={downloadPNG}
            >↓ PNG</button
          >
          <button class="button-main btn-flex" on:click={downloadGIF}
            >↓ GIF</button
          >
        </div>
      </div>

      <!-- Canvas -->
      <InputGroup label={"Tavola disegno"}>
        <!--  -->
        <InputItem>
          <InputInteger
            label="Larghezza"
            on:update={handleDraw}
            bind:value={$PatternStore.canvas.width}
          />
        </InputItem>
        <!--  -->
        <InputItem>
          <InputInteger
            label="Altezza"
            on:update={handleDraw}
            bind:value={$PatternStore.canvas.height}
          />
        </InputItem>
        <!--  -->
      </InputGroup>

      <!-- Grid -->
      <InputGroup label={"Griglia"}>
        <!--  -->
        <InputItem>
          <InputInteger
            label="Righe"
            on:update={handleDraw}
            bind:value={$PatternStore.grid.rows}
          />
        </InputItem>
        <!--  -->
        <InputItem>
          <InputInteger
            label="Colonne"
            on:update={handleDraw}
            bind:value={$PatternStore.grid.columns}
          />
        </InputItem>
        <!--  -->
        <InputItem>
          <InputFloat
            label="Distanza tra le colonne"
            on:update={handleDraw}
            bind:value={$PatternStore.grid.spacing.column}
          />
        </InputItem>
        <!--  -->
        <InputItem>
          <InputBool
            label="Riempimento"
            on:update={handleDraw}
            bind:value={$PatternStore.grid.fill}
          />
        </InputItem>
        <!--  -->
      </InputGroup>

      <!-- Densità -->
      <InputGroup label={"Densità forme"}>
        {#each Tiles as t}
          <InputItem>
            <InputInteger
              label={$TextStore.tiles[t]}
              on:update={handleDraw}
              bind:value={$PatternStore.tiles[t].density}
            />
          </InputItem>
        {/each}
      </InputGroup>

      <!-- Colore tiles -->
      <InputGroup label={"Colore forme"}>
        <InputColor on:update={handleDraw} scope="tiles" />
      </InputGroup>

      <!-- Colore sfondo -->
      <InputGroup label={"Colore sfondo"}>
        <InputColor on:update={handleDraw} gradient={true} scope="background" />
      </InputGroup>

      <!-- Thicknesses -->
      <InputGroup label={"Spessori"}>
        <InputThickness />
      </InputGroup>

      <!-- Impostazioni GIF -->
      <InputGroup label={"Impostazioni GIF"}>
        <!--  -->
        <InputItem>
          <InputInteger
            label="Durata (s)"
            bind:value={$PatternStore.gif.duration}
          />
        </InputItem>
        <!--  -->
        <InputItem>
          <InputInteger label="FPS" bind:value={$PatternStore.gif.frameRate} />
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

  .btn-flex {
    flex-basis: 32%;
  }
</style>
