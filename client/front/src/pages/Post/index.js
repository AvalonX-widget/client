import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Axios from 'axios';

import { Pagination, Table, Button, Dropdown, Input, Icon } from 'semantic-ui-react'

const ITEMS_PER_PAGE_OPTIONS = ['3', '5', '7', '10'].map((count) => ({ key: count, value: count, text: count+'개씩 보기'}));
const SEARCH_OPTIONS = [
    {key: 0, value: 'title', text: '제목으로 검색'},
    {key: 1, value: 'text', text: '내용으로 검색'},
    {key: 2, value: 'titletext', text: '제목+내용으로 검색'},
    {key: 3, value: 'username', text: '작성자명으로 검색'},
];

class Custom extends Component {
    render() {
        return (
            <Table.Row key={this.props.id}>
                <Table.Cell>{this.props.id}</Table.Cell>
                <Table.Cell><Link to={`/posts/${this.props.id}`}>{this.props.title}</Link></Table.Cell>
                <Table.Cell>{this.props.createdAt}</Table.Cell>
                <Table.Cell>{this.props.user.name}</Table.Cell>
            </Table.Row>
        );
    }
}

class Posts extends Component {
    state = {
        posts: [],
        currentPage: 1,
        total_page: 1,
        items_per_page: 10,
        search_keyword: '',
        search_condition: 'title',
    }

    constructor(props) {
        super(props);
        this.loadInfo(this.state.currentPage, this.state.items_per_page);
    }

    loadInfo = async (page, items_per_page) => {
        const params = { page, items_per_page };
        if (this.state.search_keyword && this.state.search_condition) {
            params.search_keyword = this.state.search_keyword;
            params.search_condition = this.state.search_condition;
        }
        const { data: { posts, total_page }} = await Axios.get(`http://localhost:8080/posts`, { params });
        this.setState({
            posts,
            total_page,
            currentPage: page,
            items_per_page,
        })
    };

    render() {
        return (
            <div style={{ padding: "100px" }}>
                <Dropdown
                    placeholder='N개씩 보기'
                    search
                    selection
                    options={ITEMS_PER_PAGE_OPTIONS} 
                    onChange={(e, data) => this.loadInfo(1, data.value)}/>
                <Table padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>제목</Table.HeaderCell>
                            <Table.HeaderCell>작성일자</Table.HeaderCell>
                            <Table.HeaderCell>작성자</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.posts.map((post, i) => <Custom key={i} {...post} />)}
                    </Table.Body>
                </Table>
                <br />
                <br />
                <div style={{ textAlign: 'center' }}>
                    <Pagination
                        activePage={this.state.currentPage}
                        totalPages={this.state.total_page}
                        onPageChange={(e, data) => this.loadInfo(data.activePage, this.state.items_per_page)} />
                    <Link to='/new_post'><Button primary floated='right'>추가</Button></Link>
                </div>
                
                <br />
                <br />
                <Dropdown 
                    placeholder='검색 조건'
                    selection
                    options={SEARCH_OPTIONS}
                    onChange={(e, data) => this.setState({ search_condition: data.value })}
                />
                <Input value={this.state.search_keyword} onChange={(e) => this.setState({ search_keyword: e.target.value })}/>
                <Icon name='search' onClick={() => this.loadInfo(1, this.state.items_per_page)}/>
            </div>
        );
    }
}

export default Posts;