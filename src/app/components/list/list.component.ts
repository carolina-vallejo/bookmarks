import { Component, OnInit } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  constructor(private readonly bookmarksService: BookmarksService) {}

  ngOnInit() {
    console.log('applist!');
    this.bookmarksService.getBookmarks().then(bookmarks => {
      console.log(bookmarks);

      const margin = { top: 40, right: 10, bottom: 10, left: 10 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        color = d3.scaleOrdinal(d3.schemeCategory10);

      const tooltip = d3
        .select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', 1)
        .style('background', 'white')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      const div = d3
        .select('body')
        .append('div')
        .style('position', 'relative')
        .style('width', width + margin.left + margin.right + 'px')
        .style('height', height + margin.top + margin.bottom + 'px')
        .style('left', margin.left + 'px')
        .style('top', margin.top + 'px');

      const treemap = d3
        .treemap()
        .paddingOuter(10)
        .tile(d3['treemapBinary'])
        .size([width, height]);

      const root = d3
        .hierarchy(bookmarks[0].children[0], d => d.children)
        .sum(d => {
          console.log(d);
          return d.parentId;
        });

      const tree = treemap(root);
      const colorS = d3
        .scaleLinear()
        .domain([1, root.height])
        .range([165, 320]);

      console.log('root', root.height);

      // const flat = tree.descendants().slice(1);

      // console.log(tree.leaves(), flat);

      const node = div
        .datum(root)
        .selectAll('.node')
        // .data(tree.leaves())
        .data(root.descendants())
        .enter()
        .append('div')
        .attr('class', 'node')
        .style('position', 'absolute')
        .style('min-height', '5px')
        .style('left', d => d.x0 + 'px')
        .style('top', d => d.y0 + 'px')
        .style('width', d => Math.max(0, d.x1 - d.x0 - 1) + 'px')
        .style('height', d => Math.max(0, d.y1 - d.y0 - 1) + 'px')
        .style('background', d => {
          while (d.depth > 1) d = d.parent;
          // return d3.hsl(color(d.data.title), 1, 0.5);
          return color(d.data.title);
        })
        .on('mouseover', function(d) {
          tooltip
            .transition()
            .duration(200)
            .style('opacity', 0.9);
          tooltip
            .html(`${d.parent.data.title} in ${d.data.title}`)
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px');
          console.log(d);
        })
        .on('mouseout', function(d) {
          tooltip
            .transition()
            .duration(500)
            .style('opacity', 0);
        });
      // .text(d => d.data.title);
    });
  }
}
