import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../api/api.service';

@Component({
    selector: 'tfy-tvshow-card',
    templateUrl: 'tvshow-card.component.html',
    styleUrls: ['tvshow-card.component.scss']
})

export class TvshowCardComponent implements OnInit {
    @Input() tvshow: any;
    @Input('show-episode-count') showEpisodeCount: boolean;

    constructor(private api: ApiService) {
    }

    ngOnInit() {
    }

    markAsWatched() {
        this.tvshow.markingAsWatched = true;

        this.api
            .prep('myList', 'markEpisodeAsWatched')
            .call({
                id: this.tvshow.episode.id,
                tvshowId: this.tvshow.id
            })
            .subscribe(data => {
                this.tvshow.markedAsWatched = true;
                setTimeout(() => {
                    this.tvshow = data;
                    this.tvshow.markingAsWatched = false;
                    this.tvshow.markedAsWatched = false;
                }, 280);
            }, () => {
                this.tvshow.markingAsWatched = false;
                this.tvshow.markedAsWatched = false;
            });

        // setTimeout(() => {
        //     tvshow.markedAsWatched = true;
        //     setTimeout(() => {
        //         const tomorrow = new Date();
        //         tomorrow.setDate(new Date().getDate() + 1);
        //
        //         tvshow.episode = {
        //             title: 'Second episode',
        //             number: 'S01E02',
        //             url: '/tvshow/teste/s01e02',
        //             date: tomorrow.toISOString()
        //         };
        //
        //         tvshow.markingAsWatched = false;
        //         tvshow.markedAsWatched = false;
        //     }, 280);
        // }, 1000);
    }

    isAfterToday(date) {
        return new Date(date).getTime() > new Date().getTime();
    }
}
