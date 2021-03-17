<script lang="ts">
  import InputGroup from "./components/InputGroup.svelte";
  import InputInteger from "./components/InputInteger.svelte";
  import InputItem from "./components/InputItem.svelte";

  let canvas_wdt = 500;
  const canvas_wdt_id = "canvas_width";
  let canvas_hgt = 700;
  const canvas_hgt_id = "canvas_height";

  let grid_rows = 10;
  const grid_rows_id = "grid_rows";
  let grid_cols = 20;
  const grid_cols_id = "grid_columns";

  let cell_ratio = 0.75;
  const cell_ratio_id = "cell_ratio";

  const tiles = [
    { id: "line", text: "Linea" },
    { id: "wave", text: "Onda" },
    { id: "peak", text: "Picco" },
  ];

  let line_num = 1;
  let wave_num = 1;
  let peak_num = 1;
</script>

<div>
  <!-- Canvas -->
  <InputGroup label={"Tavola disegno"}>
    <!--  -->
    <InputItem>
      <label for={canvas_wdt_id}>Larghezza</label>
      <InputInteger id={canvas_wdt_id} bind:value={canvas_wdt} />
    </InputItem>
    <!--  -->
    <InputItem>
      <label for={canvas_hgt_id}>Altezza</label>
      <InputInteger id={canvas_hgt_id} bind:value={canvas_hgt} />
    </InputItem>
  </InputGroup>

  <!-- Grid -->
  <InputGroup label={"Griglia"}>
    <!--  -->
    <InputItem>
      <label for={grid_rows_id}>Righe</label>
      <InputInteger id={grid_rows_id} bind:value={grid_rows} />
    </InputItem>
    <!--  -->
    <InputItem>
      <label for={grid_cols_id}>Colonne</label>
      <InputInteger id={grid_cols_id} bind:value={grid_cols} />
    </InputItem>
  </InputGroup>

  <!-- Densità -->
  <InputGroup label={"Densità forme"}>
    {#each tiles as tile}
      <InputItem>
        <label for="{tile.id}-num">{tile.text}</label>
        <InputInteger id="{tile.id}-num" bind:value={line_num} />
      </InputItem>
    {/each}
  </InputGroup>
</div>
