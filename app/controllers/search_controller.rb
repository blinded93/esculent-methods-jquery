class SearchController < ApplicationController
  def index
    search = SearchService.parse_and_create(params[:query])
    results = search.find_results
    render json: results, status: 200
  end
end
