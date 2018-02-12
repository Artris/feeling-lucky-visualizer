import React from 'react';
import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile } from 'material-ui/GridList';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  }
});

const cellHeight = 180;
const tileSpacing = 4;
const numberOfColumns = 2;

function ImageGridList(props) {
  const { classes, images, width, maxHeight } = props;
  const numberOfRows = Math.ceil(images.length / numberOfColumns);
  const height = Math.min(maxHeight, (cellHeight + tileSpacing) * numberOfRows);

  return (
    <div className={classes.root}>
      <GridList
        style={{ width, height }}
        cols={numberOfColumns}
        cellHeight={cellHeight}
        spacing={tileSpacing}
      >
        {images.map(url => (
          <GridListTile key={url}>
            <img src={url} alt="Invalid URL" />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

export default withStyles(styles)(ImageGridList);
