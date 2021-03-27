<script lang="ts">
  /* --- Imports --- */

  // Stores with data
  import { PatternStore, TextStore } from "./stores";

  // Svelte imports
  import InputGroup from "./components/InputGroup.svelte";
  import InputItem from "./components/InputItem.svelte";
  import InputInteger from "./components/InputInteger.svelte";
  import InputFloat from "./components/InputFloat.svelte";
  import InputColor from "./components/InputColor.svelte";
  import InputCRUD from "./components/InputCRUD.svelte";

  // TS / Logic imports
  import { Tiles } from "./ts/defs";

  import { draw, handleDraw } from "./ts/index";
  import { downloadSVG } from "./ts/download";

  window.onload = function () {
    draw();
  };
</script>

<main>
  <!--  -->

  <!-- Input -->
  <div class="input">
    <!-- Canvas -->
    <div class="btns">
      <button class="btn-draw" on:click={handleDraw}>Disegna!</button>
      <button class="btn-svg" on:click={downloadSVG}>SVG</button>
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
      <InputColor on:update={handleDraw} scope="background" />
    </InputGroup>

    <!-- Thicknesses -->
    <InputGroup label={"Spessori"}>
      <InputCRUD
        on:update={handleDraw}
        bind:array={$PatternStore.thicknesses}
      />
    </InputGroup>
  </div>

  <!-- Debug -->
  <!-- <pre style="overflow:auto">
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
    flex-basis: 300px;
    background-color: var(--cds-ui-background);
    overflow: auto;
    padding: 0 var(--aria);
    padding-bottom: var(--aria);
  }

  #output {
    flex-grow: 1;
    background-color: pink;
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
    position: sticky;
    top: 0;
    background-color: var(--cds-ui-background);
    padding: var(--aria) 0;
  }

  .btn-draw {
    margin-bottom: calc(var(--aria) / 2);
  }
</style>
